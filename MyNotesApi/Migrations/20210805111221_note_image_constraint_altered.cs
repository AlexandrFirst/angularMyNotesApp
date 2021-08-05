using Microsoft.EntityFrameworkCore.Migrations;

namespace MyNotesApi.Migrations
{
    public partial class note_image_constraint_altered : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Notes_NoteId",
                table: "Images");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Notes_NoteId",
                table: "Images",
                column: "NoteId",
                principalTable: "Notes",
                principalColumn: "NoteId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Notes_NoteId",
                table: "Images");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Notes_NoteId",
                table: "Images",
                column: "NoteId",
                principalTable: "Notes",
                principalColumn: "NoteId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
