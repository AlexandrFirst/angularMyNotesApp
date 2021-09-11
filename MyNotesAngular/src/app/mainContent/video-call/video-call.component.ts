import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationType } from 'src/app/Models/NotificationMessage';
import { RTCMessage, UserCallState } from 'src/app/Models/RTCMessage';
import { videoChatData } from 'src/app/Models/videoChatData';
import { AccessResponseMessage } from 'src/app/Services/Abstartions/ISignalRWEBRtcService';
import { NotificationService } from 'src/app/Services/notification.service';
import { VideoCallService } from 'src/app/Services/video-call.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {

  public UserState: UserCallState = UserCallState.Idle;

  private RTCConnections: RTCPeerConnection[] = [];

  private RemoteVideoStreams: MediaStream[] = [];
  private RemoteAudioStreams: MediaStream[] = [];

  private audioRtpSenders: RTCRtpSender[] = [];
  private videoRtpSenders: RTCRtpSender[] = [];

  private myAudioTrack;
  private myVideoTrack;

  public videoChatData: videoChatData;

  private iceConfig = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }, {
      urls: 'stun:stun1.l.google.com:19302'
    }, {
      urls: 'stun:stun2.l.google.com:19302'
    }, {
      urls: 'stun:stun3.l.google.com:19302'
    }]
  }

  constructor(private videoService: VideoCallService,
    private notificationService: NotificationService) { }

  ngOnInit() {

    this.videoService.instantiateCall.subscribe((userId) => {
      this.callInit(userId);
    })

    this.videoService.getOffer().subscribe(async (offer: RTCMessage) => {

      offer = JSON.parse(offer.data);

      if (!this.RTCConnections[offer.fromUserId]) {
        await this.createConnection(offer.fromUserId);
      }

      await this.RTCConnections[offer.fromUserId].setRemoteDescription(new RTCSessionDescription(offer.data));
      var answer = await this.RTCConnections[offer.fromUserId].createAnswer();
      await this.RTCConnections[offer.fromUserId].setLocalDescription(answer);

      this.videoService.sendAnswer(offer.fromUserId, JSON.stringify(answer));
    })

    this.videoService.getAnswer().subscribe(async (answer: RTCMessage) => {
      await this.RTCConnections[answer.fromUserId].setRemoteDescription(new RTCSessionDescription(answer.data));
    })


    this.videoService.getIceCandiadate().subscribe(async (icecandidate: RTCMessage) => {
      if (!this.RTCConnections[icecandidate.fromUserId]) {
        await this.createConnection(icecandidate.fromUserId);
      }

      try {
        await this.RTCConnections[icecandidate.fromUserId].addIceCandidate(icecandidate.data);
      } catch (e) {
        console.log(e);
      }
    })

    this.videoService.canAccessUserReponse().subscribe((fromUserId: number) => {

      console.log("Access user response")
      if (this.UserState == UserCallState.BeingCalled || this.UserState == UserCallState.Calling) {
        this.videoService.sendAccessReponse(fromUserId, false);
      }
      else {
        this.UserState = UserCallState.BeingCalled
        this.videoService.askUserToAccept().subscribe(data => {
          this.videoService.sendAccessReponse(fromUserId, data);
        })

      }
    })

    this.videoService.listenToDeclineCall().subscribe(() => {
      console.log("Call is declined")
      this.UserState = UserCallState.Idle;
    })

  }

  callInit(userId) {

    if (this.UserState == UserCallState.Idle) {
      this.UserState = UserCallState.Calling

      this.videoService.canAccessUserRequest(userId).subscribe((accessResponseMesage: AccessResponseMessage) => {
        if (!accessResponseMesage.canAccess) {
          console.log("Can't access user")
          this.UserState = UserCallState.Idle;
          return;
        }
        else {
          this.processMedia();
          this.createConnection(userId);
        }
      })

      this.videoService.askUserToAccept().subscribe(data => {
        this.UserState = UserCallState.Idle

        this.videoService.declineCall(userId);
      })

    }

  }

  async createConnection(userId) {
    let webRTCConnection = new RTCPeerConnection(this.iceConfig);
    this.RTCConnections[userId] = webRTCConnection;

    webRTCConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.videoService.iceCandidateSend(userId, JSON.stringify(event.candidate));
      }
    }

    webRTCConnection.onnegotiationneeded = async () => {
      await this.createOffer(userId);
    }

    webRTCConnection.ontrack = async (event: RTCTrackEvent) => {
      if (!this.RemoteVideoStreams[userId]) {
        this.RemoteVideoStreams[userId] = new MediaStream();
      }

      if (!this.RemoteAudioStreams[userId]) {
        this.RemoteAudioStreams[userId] = new MediaStream();
      }

      if (event.track.kind == 'video') {
        this.RemoteVideoStreams[userId].getTracks().forEach(t => this.RemoteVideoStreams[userId].removeTrack(t));
        this.RemoteVideoStreams[userId].addTrack(event.track);

      } else if (event.track.kind == 'audio') {
        this.RemoteAudioStreams[userId].getTracks().forEach(t => this.RemoteAudioStreams[userId].removeTrack(t));
        this.RemoteAudioStreams[userId].addTrack(event.track);
      }

      this.updateMediaSenders(this.myVideoTrack, this.videoRtpSenders);
    }

    webRTCConnection.onconnectionstatechange = (event) => {
      switch (webRTCConnection.connectionState) {
        case "connected":
          this.UserState == UserCallState.Idle
          break;
      }
    }

    return webRTCConnection;
  }


  async createOffer(userId) {
    let connection = this.RTCConnections[userId];
    let offer = await connection.createOffer();

    await connection.setLocalDescription(offer);

    this.videoService.sendOffer(userId, JSON.stringify(offer));

  }


  async processMedia() {
    try {
      var vstream = null;
      vstream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 720,
          height: 480
        },
        audio: false
      });

      var astream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
      });

      this.myAudioTrack = astream.getAudioTracks()[0];
      this.myAudioTrack.enabled = true;

      this.updateMediaSenders(this.myAudioTrack, this.audioRtpSenders)

      this.myVideoTrack = vstream.getVideoTracks()[0];


      this.updateMediaSenders(this.myVideoTrack, this.audioRtpSenders)
    } catch (e) {
      console.log(e);
    }
  }

  updateMediaSenders(track, rtpSenders) {
    for (var userId in this.RTCConnections) {
      var connections = this.RTCConnections[userId];
      if (connections && (connections.connectionState == "new" ||
        connections.connectionState == "connecting" ||
        connections.connectionState == "connected")) {
        if (rtpSenders[userId] && rtpSenders[userId].track) {
          rtpSenders[userId].replaceTrack(track);
        } else {
          rtpSenders[userId] = this.RTCConnections[userId].addTrack(track);
        }
      }
    }

    this.videoChatData = {
      RemoteAudioStreams: this.RemoteAudioStreams,
      RemoteVideoStreams: this.RemoteVideoStreams,
      connectionCount: (this.audioRtpSenders.length > this.videoRtpSenders.length ? this.audioRtpSenders : this.videoRtpSenders),
      myVideoTrack: this.myVideoTrack
    }
  }
}
