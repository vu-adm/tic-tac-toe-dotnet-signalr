using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TicTacToe.Config;
using TicTacToe.Services;

namespace TicTacToe {
	public class Startup {
		public Startup(IConfiguration configuration) {
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services) {
			services.AddCors(options =>  {
				options.AddPolicy("CorsPolicy", builder => builder.WithOrigins("http://localhost:4200", "http://localhost:8080")
								.AllowAnyMethod()
								.AllowAnyHeader()
								.AllowCredentials());
			});
			services.AddControllers();
			services.AddSignalR();
			services.AddScoped<IGameService, InMemoryGameServiceImpl>();
			services.AddScoped<IGameHub, GameHub>();
			services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
			} else {
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseCors("CorsPolicy");

			app.UseAuthorization();

			app.UseEndpoints(endpoints => {
				endpoints.MapControllers();
				endpoints.MapHub<GameHub>("/game");
			});
		}
	}
}
