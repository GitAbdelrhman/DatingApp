using DatingAppAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Threading.Tasks;

namespace DatingAppAPI.Data
{
    public class DataContext :DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes  { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder Builder)
        {
            Builder.Entity<Like>()
                .HasKey(k => new { k.LikerId, k.LikeeId });

            Builder.Entity<Like>()
                .HasOne(u => u.Likee)
                .WithMany(u => u.likers)
                .HasForeignKey(u => u.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);
            Builder.Entity<Like>()
               .HasOne(u => u.Liker)
               .WithMany(u => u.likees)
               .HasForeignKey(u => u.LikerId)
               .OnDelete(DeleteBehavior.Restrict);

            Builder.Entity<Message>()
              .HasOne(u => u.Sender)
              .WithMany(u => u.MessagesSent)
              .OnDelete(DeleteBehavior.Restrict);
            Builder.Entity<Message>()
               .HasOne(u => u.Recipient)
               .WithMany(u => u.MessagesReceived)
               .OnDelete(DeleteBehavior.Restrict);

        }


    }
}
