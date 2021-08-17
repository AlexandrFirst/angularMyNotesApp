using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyNotesApi.DataContext;
using MyNotesApi.ServiceProtos;
using MyNotesApi.Services;
using MyNotesApi.Helpers;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;

using Microsoft.EntityFrameworkCore;
using MyNotesApi.Helpers.ExceptionHandler;
using Microsoft.Extensions.Options;

namespace MyNotesApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            #region Example of how to create DbContextOptions manually

            var optionsBuilder = new DbContextOptionsBuilder<MyDataContext>();
            optionsBuilder.UseSqlServer(Configuration["ConnectionString:NoteDB"]);

            #endregion


            #region Example of how to create IOptions manually

            var dbSettingsValue = new DatabaseSettings();
            Configuration.GetSection("ConnectionString").Bind(dbSettingsValue);
            var options = Options.Create<DatabaseSettings>(dbSettingsValue);

            #endregion

            // using (MyDataContext dbContext
            //             = new MyDataContext(options))
            using (MyDataContext dbContext
                        = new MyDataContext(optionsBuilder.Options))
            {
                if (dbContext.Users.Count() == 0)
                {

                    string jsonstring = System.IO.File.ReadAllText("./Resources/user_seed.json");

                    List<User> usersToAdd = JsonConvert.DeserializeObject<List<User>>(jsonstring);

                    dbContext.Users.AddRange(usersToAdd);
                    dbContext.SaveChanges();
                }
            }

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddHttpContextAccessor();
            services.AddAutoMapper(typeof(Startup));

            services.AddControllers();

            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.Configure<DatabaseSettings>(Configuration.GetSection("ConnectionString"));
            services.Configure<CloudinaryHelper>(Configuration.GetSection("CloudinarySettings"));

            services.AddDbContext<MyDataContext>(opt => opt.UseSqlServer(Configuration["ConnectionString:NoteDB"]));
            //services.AddDbContext<MyDataContext>();
            services.AddScoped<IUserContextService, UserContextService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IPostService, PostService>();

            services.AddControllers().AddNewtonsoftJson(o =>
            {
                o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.ConfigureExceptionHandler();

            app.ConfigureCustomExceptionMiddleware();

            app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());



            app.UseRouting();

            app.UseMiddleware<JwtMiddleware>();


            // app.UseAuthentication();
            // app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
