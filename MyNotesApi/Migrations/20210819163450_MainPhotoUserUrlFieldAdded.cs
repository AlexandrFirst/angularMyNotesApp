using Microsoft.EntityFrameworkCore.Migrations;

namespace MyNotesApi.Migrations
{
    public partial class MainPhotoUserUrlFieldAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MainPhotoUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MainPhotoUrl",
                table: "Users");
        }
    }
}
