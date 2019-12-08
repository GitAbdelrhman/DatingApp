using DatingAppAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppAPI.Data
{
  public  interface IAuthRepositoy
    {
        Task<User> Register(User User, string Password);
        Task<User> Login(string UserName, string Password);
        Task<bool> UserExists(string UserName);

    }
}
