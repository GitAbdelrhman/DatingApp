using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingAppAPI.Data;
using DatingAppAPI.Dtos;
using DatingAppAPI.Helpers;
using DatingAppAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingAppAPI.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly IDatingRepository _Repo;
        private readonly IMapper _Mapper;

        public UsersController (IDatingRepository  repo , IMapper mapper )
        {
            _Repo = repo;
            _Mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {
            var CurrentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var UserFromRepo = await _Repo.GetUser(CurrentUserId);
            userParams.UserId = CurrentUserId;
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = UserFromRepo.Gender == "male" ? "female" : "male";

            }
            var Users = await _Repo.GetUsers(userParams);
            var UsersToReturn = _Mapper.Map<IEnumerable<UserForListDTO>>(Users);
            Response.AddPagination(Users.CurrentPage, Users.PageSize, Users.TotalCount,Users.TotalPages);
            return Ok(UsersToReturn);
        }
        [HttpGet ("{id}",Name ="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var User = await _Repo.GetUser(id);
            var UserToReturn = _Mapper.Map<UserForDetailedDTO>(User);
            return Ok(UserToReturn);

        }
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int RecipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var like = await _Repo.GetLike(id, RecipientId);
            if (like != null)
                return BadRequest("You already liked this user ");
            if (await _Repo.GetUser(RecipientId) == null)
                return NotFound();
            like = new Like
            {
                LikerId = id,
                LikeeId = RecipientId
            };
            _Repo.Add<Like>(like);
            if (await _Repo.SaveAll())
                return Ok();

            return BadRequest("Failed to like user ");

        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdaeUser(int id , UserForUpdateDTO UserForUpdate)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var UserFromRepo = await _Repo.GetUser(id);
             _Mapper.Map(UserForUpdate, UserFromRepo);
            if (await _Repo.SaveAll())
                return NoContent();
            throw new Exception($"Updateing user {id} failed on server");
        }
    }
}