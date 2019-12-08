using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingAppAPI.Data;
using DatingAppAPI.Dtos;
using DatingAppAPI.Helpers;
using DatingAppAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingAppAPI.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IDatingRepository _repo;
        private readonly IOptions<CloudinarySettings> _cloudSeting;
        private Cloudinary _Cloudinary;
        public PhotosController (IMapper mapper , IDatingRepository repo , IOptions <CloudinarySettings> cloudSeting )
        {
            _mapper = mapper;
            _repo = repo;
            _cloudSeting = cloudSeting;
            Account acc = new Account(
                _cloudSeting.Value.CloudName,
                _cloudSeting.Value.ApiKey,
                _cloudSeting.Value.ApiSecret
                );
            _Cloudinary = new Cloudinary(acc);
        }
        [HttpGet("{Id}" , Name ="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int Id)
        {
            var PhotoFromRepo =await _repo.GetPhoto(Id);
            var Photo =  _mapper.Map<PhotoForReturnDTO>(PhotoFromRepo);
            return Ok(Photo); 
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeletePhoto (int UserId ,int Id)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var PhotoFromRepo = await _repo.GetPhoto(Id);
            var DeleteParam = new DeletionParams(PhotoFromRepo.PublicId);
            var Result = _Cloudinary.Destroy(DeleteParam);
            if (Result.Result == "ok")
            {
                _repo.DeletePhoto(Id);
            }
            if (await _repo.SaveAll())
                return Ok();
            return BadRequest("could not Delete Photo ");

        }
        [HttpPost("{Id}/SetMain")]
        public async Task<IActionResult> SetMainPhoto(int UserId , int Id)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var PhotoFromRepo = await _repo.GetPhoto(Id);
            if (PhotoFromRepo.IsMain == true )
                return BadRequest("Photo Already the main");
            var CurrentMainphoto = await _repo.GetMainPhoto(UserId);
            PhotoFromRepo.IsMain = true;
            CurrentMainphoto.IsMain = false;
            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest("could not set photo to main ");
        }
        [HttpPost]
        public async Task<IActionResult> AddPhotoToUser( int UserId ,[FromForm] PhotoForCreationDTO PhotoForCreationDTO)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var UserFromRepo = await _repo.GetUser(UserId);
            var File = PhotoForCreationDTO.File;
            var UploadReult = new ImageUploadResult();
            if (File.Length >0)
            {
                using (var stream = File.OpenReadStream())
                {
                    var UploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(File.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    UploadReult = _Cloudinary.Upload(UploadParams);
                }

            }
            PhotoForCreationDTO.Url = UploadReult.Uri.ToString();
            PhotoForCreationDTO.PublicId = UploadReult.PublicId;
            var photo = _mapper.Map<Photo>(PhotoForCreationDTO);
            if (!UserFromRepo.Photos.Any(d => d.IsMain))
                photo.IsMain = true;
            UserFromRepo.Photos.Add(photo);
            if (await _repo.SaveAll())
            {
                var PhotoToReturn = _mapper.Map<PhotoForReturnDTO>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id }, PhotoToReturn);
            }
            return BadRequest("Could not add the photo");
        }

    }
}