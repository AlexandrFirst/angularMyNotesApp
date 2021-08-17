using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MyNotesApi.DataContext.ModelConfiguration;
using MyNotesApi.Helpers;

namespace MyNotesApi.DataContext
{
    public class MyDataContext : DbContext
    {
        public virtual DbSet<Image> Images { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<Note> Notes { get; set; }
        public virtual DbSet<Repost> Reposts { get; set; }
        public virtual DbSet<User> Users { get; set; }

        public MyDataContext(DbContextOptions<MyDataContext> options) : base(options)
        {
            Database.Migrate();
            this.ChangeTracker.LazyLoadingEnabled = false;
        }
        private readonly DatabaseSettings dbSettings;
        // public MyDataContext(IOptions<DatabaseSettings> dbSettings)
        // {
        //     this.dbSettings = dbSettings.Value;
        //     this.ChangeTracker.LazyLoadingEnabled = false;
        // }

        // protected override void OnConfiguring(DbContextOptionsBuilder contextOptions)
        // {
        //     // contextOptions.UseSqlServer("Server = (localdb)\\MSSQLLocalDB; Database = MyNoteDB; Trusted_Connection = True;");
        //     contextOptions.UseSqlServer(dbSettings.NoteDB);

        // }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new NoteConfig());
            modelBuilder.ApplyConfiguration(new UserConfig());
        }
    }
}