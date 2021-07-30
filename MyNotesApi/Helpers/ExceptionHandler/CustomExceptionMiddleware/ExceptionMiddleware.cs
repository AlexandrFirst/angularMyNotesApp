using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MyNotesApi.Helpers.ExceptionHandler.CustomExceptions;

namespace MyNotesApi.Helpers.ExceptionHandler.CustomExceptionMiddleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleEceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleEceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            string message = exception switch
            {
                UserExistsException => "User exception: " + exception.Message,
                PhotoUploadException => "Photo ecextion: " + exception.Message,
                _ => exception.Message
            };

            await context.Response.WriteAsync(new ErrorDetails()
            {
                StatusCode = context.Response.StatusCode,
                Message = message
            }.ToString());
        }
    }
}