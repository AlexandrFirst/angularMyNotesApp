﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MyNotesApi.DataContext;

namespace MyNotesApi.Migrations
{
    [DbContext(typeof(MyDataContext))]
    [Migration("20210716104105_Init")]
    partial class Init
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.8")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MyNotesApi.DataContext.Image", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("IsTitleImage")
                        .HasColumnType("bit");

                    b.Property<int?>("NoteId")
                        .HasColumnType("int");

                    b.Property<string>("PublicKey")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ImageId");

                    b.HasIndex("NoteId");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Like", b =>
                {
                    b.Property<int>("LikeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("LikeDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("NoteId")
                        .HasColumnType("int");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("LikeId");

                    b.HasIndex("NoteId");

                    b.HasIndex("UserId");

                    b.ToTable("Likes");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Note", b =>
                {
                    b.Property<int>("NoteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AuthorId")
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("PublicationDate")
                        .HasColumnType("datetime2");

                    b.HasKey("NoteId");

                    b.HasIndex("AuthorId");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Repost", b =>
                {
                    b.Property<int>("RepostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("NoteId")
                        .HasColumnType("int");

                    b.Property<DateTime>("RepostDate")
                        .HasColumnType("datetime2");

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
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Mail")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MyNotesApi.DataContext.Image", b =>
                {
                    b.HasOne("MyNotesApi.DataContext.Note", "Note")
                        .WithMany("NoteImages")
                        .HasForeignKey("NoteId");

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

                    b.Navigation("Reposts");
                });
#pragma warning restore 612, 618
        }
    }
}