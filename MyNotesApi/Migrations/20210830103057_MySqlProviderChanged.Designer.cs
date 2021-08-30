﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyNotesApi.DataContext;

namespace MyNotesApi.Migrations
{
    [DbContext(typeof(MyDataContext))]
    [Migration("20210830103057_MySqlProviderChanged")]
    partial class MySqlProviderChanged
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 64)
                .HasAnnotation("ProductVersion", "5.0.9");

            modelBuilder.Entity("MyNotesApi.DataContext.Image", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<bool>("IsTitleImage")
                        .HasColumnType("tinyint(1)");

                    b.Property<int?>("NoteId")
                        .HasColumnType("int");

                    b.Property<string>("PublicKey")
                        .HasColumnType("longtext");

                    b.Property<string>("Url")
                        .HasColumnType("longtext");

                    b.HasKey("ImageId");

                    b.HasIndex("NoteId");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Like", b =>
                {
                    b.Property<int>("LikeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("LikeDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("NoteId")
                        .HasColumnType("int");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("LikeId");

                    b.HasIndex("NoteId");

                    b.HasIndex("UserId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Message", b =>
                {
                    b.Property<int>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("FromUserId")
                        .HasColumnType("int");

                    b.Property<string>("MessageText")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("SendTime")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("ToUserId")
                        .HasColumnType("int");

                    b.HasKey("MessageId");

                    b.HasIndex("FromUserId");

                    b.HasIndex("ToUserId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Note", b =>
                {
                    b.Property<int>("NoteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("AuthorId")
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("PublicationDate")
                        .HasColumnType("datetime(6)");

                    b.HasKey("NoteId");

                    b.HasIndex("AuthorId");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Repost", b =>
                {
                    b.Property<int>("RepostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int?>("NoteId")
                        .HasColumnType("int");

                    b.Property<DateTime>("RepostDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("RepostId");

                    b.HasIndex("NoteId");

                    b.HasIndex("UserId");

                    b.ToTable("Reposts");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Mail")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("MainPhotoUrl")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .HasColumnType("longtext");

                    b.Property<string>("Role")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Mail")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("UserUser", b =>
                {
                    b.Property<int>("FollowersId")
                        .HasColumnType("int");

                    b.Property<int>("SubscribersId")
                        .HasColumnType("int");

                    b.HasKey("FollowersId", "SubscribersId");

                    b.HasIndex("SubscribersId");

                    b.ToTable("UserUser");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Image", b =>
                {
                    b.HasOne("MyNotesApi.DataContext.Note", "Note")
                        .WithMany("NoteImages")
                        .HasForeignKey("NoteId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Note");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Like", b =>
                {
                    b.HasOne("MyNotesApi.DataContext.Note", "Note")
                        .WithMany("Likes")
                        .HasForeignKey("NoteId");

                    b.HasOne("MyNotesApi.DataContext.User", "User")
                        .WithMany("Likes")
                        .HasForeignKey("UserId");

                    b.Navigation("Note");

                    b.Navigation("User");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Message", b =>
                {
                    b.HasOne("MyNotesApi.DataContext.User", "FromUser")
                        .WithMany("ReceivedMessages")
                        .HasForeignKey("FromUserId");

                    b.HasOne("MyNotesApi.DataContext.User", "ToUser")
                        .WithMany("SentMessages")
                        .HasForeignKey("ToUserId");

                    b.Navigation("FromUser");

                    b.Navigation("ToUser");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Note", b =>
                {
                    b.HasOne("MyNotesApi.DataContext.User", "Author")
                        .WithMany("Notes")
                        .HasForeignKey("AuthorId");

                    b.Navigation("Author");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Repost", b =>
                {
                    b.HasOne("MyNotesApi.DataContext.Note", "Note")
                        .WithMany("Reposts")
                        .HasForeignKey("NoteId");

                    b.HasOne("MyNotesApi.DataContext.User", "User")
                        .WithMany("Reposts")
                        .HasForeignKey("UserId");

                    b.Navigation("Note");

                    b.Navigation("User");
                });

            modelBuilder.Entity("UserUser", b =>
                {
                    b.HasOne("MyNotesApi.DataContext.User", null)
                        .WithMany()
                        .HasForeignKey("FollowersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MyNotesApi.DataContext.User", null)
                        .WithMany()
                        .HasForeignKey("SubscribersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Note", b =>
                {
                    b.Navigation("Likes");

                    b.Navigation("NoteImages");

                    b.Navigation("Reposts");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.User", b =>
                {
                    b.Navigation("Likes");

                    b.Navigation("Notes");

                    b.Navigation("ReceivedMessages");

                    b.Navigation("Reposts");

                    b.Navigation("SentMessages");
                });
#pragma warning restore 612, 618
        }
    }
}