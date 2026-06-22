using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEmergencyOtpFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EmergencyOtpApproved",
                table: "Orders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "EmergencyOtpReason",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmergencyOtpRequested",
                table: "Orders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmergencyOtpRequestedAt",
                table: "Orders",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmergencyOtpApproved",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "EmergencyOtpReason",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "EmergencyOtpRequested",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "EmergencyOtpRequestedAt",
                table: "Orders");
        }
    }
}
