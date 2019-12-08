using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppAPI.Helpers;
using DatingAppAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAppAPI.Data
{
    public class DatingRepository : IDatingRepository
    {
        public DataContext _Context;
        public DatingRepository(DataContext context)
        {
            _Context = context;
        }


        public void Add<T>(T entity) where T : class
        {
            _Context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _Context.Remove(entity);
        }

        public void DeletePhoto(int PhotoId)
        {
            var PhotoObj = _Context.Photos.FirstOrDefault(f => f.Id == PhotoId);
            _Context.Photos.Remove(PhotoObj);
        }

        public async Task<Like> GetLike(int UserId, int RecipientId)
        {
            return await _Context.Likes.FirstOrDefaultAsync(u => u.LikerId == UserId && u.LikeeId == RecipientId);
        }

        public async Task<Photo> GetMainPhoto(int UserId)
        {
            return await _Context.Photos.Where(f => f.UserId  == UserId).FirstOrDefaultAsync(f=>f.IsMain );
        }

        public async Task<Photo> GetPhoto(int Id)
        {
            var Photo = await _Context.Photos.FirstOrDefaultAsync(f => f.Id == Id );
            return Photo; 
        }

        public async  Task<User> GetUser(int ID)
        {
            var User = await  _Context.Users.Include(d => d.Photos).FirstOrDefaultAsync(d => d.Id == ID);
            return User;
        }
        private async Task<IEnumerable<int>> GetUserLikes(int id , bool likers)
        {
            var user = await _Context.Users.Include(f => f.likers).Include(f => f.likees).FirstOrDefaultAsync(f => f.Id == id);
            if (likers)
                return user.likers.Where(g => g.LikeeId == id).Select(i => i.LikerId);
            else
                return user.likees.Where(g => g.LikerId == id).Select(i => i.LikeeId);
            
        }

        public async  Task<PagedList<User>> GetUsers(UserParams userParams)
        {
             var users = _Context.Users.Include(f => f.Photos).OrderByDescending(g=>g.LastActive).AsQueryable();
            users = users.Where(d => d.Id != userParams.UserId);
            users = users.Where(o => o.Gender == userParams.Gender);
           
            if (userParams.Likers)
            {
                var UserLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(i => UserLikers.Contains(i.Id));
            }
            if (userParams.Likees)
            {
                var UserLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(i => UserLikees.Contains(i.Id));
            }
            if (userParams.MinAge != 18 || userParams.MaxAge !=99)
            {
                var MinDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var MaxDob = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(o => o.DateOfBirth >= MinDob && o.DateOfBirth <= MaxDob);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users.OrderByDescending(j => j.Created);
                        break;
                    default:
                        users.OrderByDescending(l => l.LastActive);
                        break;

                }
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async  Task<bool> SaveAll()
        {
            return await _Context.SaveChangesAsync()>0;
        }

        public async Task<Message> GetMessage(int Id)
        {
            return await _Context.Messages.FirstOrDefaultAsync(f => f.Id == Id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {

            var Messages = _Context.Messages.Include(f => f.Sender).ThenInclude(g => g.Photos)
            .Include(f => f.Recipient).ThenInclude(f => f.Photos).AsQueryable();
            switch (messageParams.MessageContainer )
            {
                case "Inbox":
                    Messages = Messages.Where(d => d.RecipientId == messageParams.UserId && d.RecipientDeleted == false);
                    break;
                case "Outbox":
                    Messages = Messages.Where(d => d.SenderId == messageParams.UserId && d.SenderDeleted == false );
                    break;
                default:
                    Messages = Messages.Where(d => d.RecipientId == messageParams.UserId && d.IsRead == false && d.RecipientDeleted == false);
                    break;
            }
            Messages = Messages.OrderByDescending(f => f.MessageSent);
            return await PagedList<Message>.CreateAsync(Messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int UserId, int RecipentId)
        {
            var Messages = await _Context.Messages.Include(f => f.Sender).ThenInclude(g => g.Photos)
            .Include(f => f.Recipient).ThenInclude(f => f.Photos)
            .Where(f => f.RecipientId == UserId && f.SenderId == RecipentId && f.RecipientDeleted == false 
            || f.RecipientId == RecipentId && f.SenderId == UserId && f.SenderDeleted == false ).ToListAsync();
            return Messages;
        }
    }
}
