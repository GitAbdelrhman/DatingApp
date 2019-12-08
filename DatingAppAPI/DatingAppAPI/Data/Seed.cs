using DatingAppAPI.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppAPI.Data
{
    public class Seed
    {
        private readonly DataContext _Context;
        public Seed(DataContext context)
        {
            _Context = context;
        }
        public void SeedUsers()
        {
            var UserData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var Users = JsonConvert.DeserializeObject<List<User>>(UserData);
            foreach (var User in Users )
            {
                byte[] PasswordHash, PasswordSalt;
                CreatePasswordHash("Password", out PasswordHash, out PasswordSalt);
                User.PasswordHash = PasswordHash;
                User.PasswordSalt = PasswordSalt;
                User.UserName = User.UserName.ToLower();
                _Context.Users.Add(User);

            }
            _Context.SaveChanges();
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }
    }
}
