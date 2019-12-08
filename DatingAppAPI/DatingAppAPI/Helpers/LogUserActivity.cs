using DatingAppAPI.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace DatingAppAPI.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var ResultContext = await next();
            var UserId = int.Parse(ResultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var Repo = ResultContext.HttpContext.RequestServices.GetService<IDatingRepository>();
            var User = await Repo.GetUser(UserId);
            User.LastActive = DateTime.Now;
            await Repo.SaveAll();

        }
    }
}
