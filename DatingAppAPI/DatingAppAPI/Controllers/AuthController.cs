using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingAppAPI.Data;
using DatingAppAPI.Dtos;
using DatingAppAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingAppAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController  :ControllerBase 
    {
        private readonly IAuthRepositoy  _Repo;
        private readonly IConfiguration _Config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepositoy repo , IConfiguration Configuration , IMapper mapper )
        {
            _Repo = repo;
            _Config = Configuration;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public  async Task<IActionResult >Register (UserForRegisterDTO UserForRegisterDTO)
        {
            UserForRegisterDTO.UserName  = UserForRegisterDTO.UserName.ToLower();
            if (await _Repo.UserExists(UserForRegisterDTO.UserName)) return BadRequest("User Name Already Exist");
            var UserToCreate = _mapper.Map<User>(UserForRegisterDTO);
            var CreatedUser = await _Repo.Register(UserToCreate, UserForRegisterDTO.Password);

            var UserToreturn = _mapper.Map<UserForDetailedDTO>(CreatedUser);

            return CreatedAtRoute("GetUser", new { contrller = "users", id = CreatedUser.Id }, UserToreturn);

        }
        [HttpPost("Login")]

        public async  Task<IActionResult >Login (UserForLoginDTO userForLoginDTO)
        {
            var UserFromRepo = await _Repo.Login(userForLoginDTO.UserName, userForLoginDTO.Password);
            if (UserFromRepo == null) return Unauthorized();
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier , UserFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name ,UserFromRepo.UserName )
            };
            var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_Config.GetSection("AppSettings:Token").Value));
            var Creds = new SigningCredentials(Key, SecurityAlgorithms.HmacSha512Signature);
            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = Creds
            };
            var TokenHandler = new JwtSecurityTokenHandler();
            var Token = TokenHandler.CreateToken(TokenDescriptor);
            var User = _mapper.Map<UserForListDTO>(UserFromRepo);
            return Ok(new
            {
                Token = TokenHandler.WriteToken(Token),
                User

            });
        }
    }
}