using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyNotesApi.DataContext.ModelConfiguration
{
    public class NoteConfig : IEntityTypeConfiguration<Note>
    {
        public void Configure(EntityTypeBuilder<Note> builder)
        {
            builder.HasMany(n => n.NoteImages)
                   .WithOne(i => i.Note);

            builder.HasMany(n => n.Likes)
                   .WithOne(l => l.Note);

            builder.HasMany(n => n.Reposts)
                   .WithOne(r => r.Note);
        }
    }
}