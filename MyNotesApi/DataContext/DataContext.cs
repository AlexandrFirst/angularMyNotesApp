using Microsoft.EntityFrameworkCore;
using MyNotesApi.DataContext.ModelConfiguration;

namespace MyNotesApi.DataContext
{
    public class MyDataContext : DbContext
    {
        public virtual DbSet<Image> Images { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<Note> Notes { get; set; }
        public virtual DbSet<Repost> Reposts { get; set; }
        public virtual DbSet<User> Users { get; set; }

        // public MyDataContext(DbContextOptions<MyDataContext> options) : base(options)
        // {
        //     this.ChangeTracker.LazyLoadingEnabled = false;
        // }
        public MyDataContext()
        {
            this.ChangeTracker.LazyLoadingEnabled = false;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder contextOptions)
        {
            contextOptions.UseSqlServer("Server = (localdb)\\MSSQLLocalDB; Database = MyNoteDB; Trusted_Connection = True;");
            //contextOptions.UseSqlServer("Server = (localdb)\\mssqllocaldb; Database = KinderDatabase; Trusted_Connection = True;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new NoteConfig());
            modelBuilder.ApplyConfiguration(new UserConfig());
        }
    }
}