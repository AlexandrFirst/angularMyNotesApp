using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyNotesApi.DataContext.ModelConfiguration
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasMany(u => u.Notes)
                   .WithOne(n => n.Author);

            builder.HasMany(u => u.Likes)
                   .WithOne(l => l.User);

            builder.HasMany(u => u.Reposts)
                   .WithOne(r => r.User);
            
            builder.HasIndex(u => u.Mail)
                   .IsUnique();
        }
    }
}