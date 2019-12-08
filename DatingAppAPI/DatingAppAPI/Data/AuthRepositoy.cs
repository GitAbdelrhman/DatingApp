using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAppAPI.Data
{
    public class AuthRepositoy : IAuthRepositoy
    {
        private readonly DataContext _context;
        public AuthRepositoy(DataContext context  )
        {
            _context = context;
        }
        public async  Task<User> Login(string UserName, string Password)
        {
            var User = await _context.Users.Include(f=>f.Photos).FirstOrDefaultAsync(s => s.UserName == UserName);
            if (User == null )
            {
                return null;
            }
            if (!VerifyPasswordHash(Password, User.PasswordHash, User.PasswordSalt))
                return null;

            return User;
            
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var ComputedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < ComputedHash.Length ; i++)
                {
                    if (ComputedHash[i] != passwordHash[i]) return false;

                }
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
            return true;
        }

        public async  Task<User> Register(User User, string Password)
        {
            byte[] PasswordHash, PasswordSalt;
            CreatePasswordHash(Password, out PasswordHash, out PasswordSalt);
            User.PasswordHash = PasswordHash;
            User.PasswordSalt = PasswordSalt;
            await _context.Users.AddAsync(User);
            await _context.SaveChangesAsync();
            return User;
        }

        private   void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac= new System.Security.Cryptography.HMACSHA512 ())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

            }
        }

        public async  Task<bool> UserExists(string UserName)
        {
            return await _context.Users.AnyAsync(d => d.UserName == UserName);
        }
    }
}
