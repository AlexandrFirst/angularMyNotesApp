import { Component, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/Models/NotificationMessage';
import { RTCMessage } from 'src/app/Models/RTCMessage';
import { NotificationService } from 'src/app/Services/notification.service';
import { VideoCallService } from 'src/app/Services/video-call.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {

  
  public isConnectionEstablihed: boolean = false;
  
  private RTCConnections: RTCPeerConnection[] = [];
  
  private RemoteVideoStreams: MediaStream[] = [];
  private RemoteAudioStreams: MediaStream[] = [];
  
  private audioRtpSenders: RTCRtpSender[] = [];
  private videoRtpSenders: RTCRtpSender[] = [];

  private myAudioTrack;
  public myVideoTrack;

  private iceConfig = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }, {
      urls: 'stun:stun1.l.google.com:19302'
    }, {
      urls: 'stun:stun2.l.google.com:19302'
    }, {
      urls: 'stun:stun3.l.google.com:19302'
    }, {
      urls: 'stun:stun4.l.google.com:19302'
    }]
  }

  constructor(private videoService: VideoCallService,
    private notificationService: NotificationService) { }

  ngOnInit() {

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

  }

  callInit(userId){
    this.processMedia();
    this.createConnection(userId);

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
    for (var con_id in this.RTCConnections) {
      var connections = this.RTCConnections[con_id];
      if (connections && (connections.connectionState == "new" ||
        connections.connectionState == "connecting" ||
        connections.connectionState == "connected")) {
        if (rtpSenders[con_id] && rtpSenders[con_id].track) {
          rtpSenders[con_id].replaceTrack(track);
        } else {
          rtpSenders[con_id] = this.RTCConnections[con_id].addTrack(track);
        }
      }
    }
  }
}
