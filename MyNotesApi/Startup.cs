using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyNotesApi.DataContext;
using MyNotesApi.ServiceProtos;
using MyNotesApi.Services;
using MyNotesApi.Helpers;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace MyNotesApi
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;


            var optionsBuilder = new DbContextOptionsBuilder();
            using (MyDataContext dbContext
                        = new MyDataContext())
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

            services.AddAutoMapper(typeof(Startup));

            services.AddControllers();

            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

            // services.AddDbContext<MyDataContext>(opt => opt.UseSqlServer(Configuration["ConnectionString:NoteDB"]));
            services.AddDbContext<MyDataContext>();
            services.AddScoped<IAuthService, AuthService>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseMiddleware<JwtMiddleware>();

            // app.UseAuthentication();
            // app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
