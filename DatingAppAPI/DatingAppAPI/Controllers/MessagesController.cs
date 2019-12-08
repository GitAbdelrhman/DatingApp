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
    [Authorize]
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/users/{userId}/[Controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{Id}",Name ="GetMessage")]
        public async Task<IActionResult> GetMessage(int UserId , int Id)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var MessageFromRepo = await _repo.GetMessage(Id);
            if (MessageFromRepo == null)
                return NotFound();
            return Ok(MessageFromRepo);
        }
        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int UserId ,[FromQuery] MessageParams messageParams)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageParams.UserId = UserId;
            var MessagesFormRepo =await  _repo.GetMessagesForUser(messageParams);
            var messages = _mapper.Map<IEnumerable<MessageToReturnDTO>>(MessagesFormRepo);
            Response.AddPagination(MessagesFormRepo.CurrentPage, MessagesFormRepo.PageSize
                , MessagesFormRepo.TotalCount, MessagesFormRepo.TotalPages);
            return Ok(messages);
        }
        [HttpGet("Thread/{RecipientId}")]
        public async Task<IActionResult> GetTMessageThread(int UserId ,int RecipientId)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var MessageThreadFromRepo = await _repo.GetMessageThread(UserId, RecipientId);
            var MessageThread = _mapper.Map<IEnumerable<MessageToReturnDTO>>(MessageThreadFromRepo);
            return Ok(MessageThread);
        }
        [HttpPost]
        public async Task<IActionResult> CreateMessage(int UserId , MessageForCreationDTO messageForCreation )
        {
            var sender = await _repo.GetUser(UserId);
            if (sender.Id  != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageForCreation.SenderId = UserId;
            var Recipient = await _repo.GetUser(messageForCreation.RecipientId);
            if (Recipient == null)
                return BadRequest("Could not find user");
            var Message = _mapper.Map<Message>(messageForCreation);
            _repo.Add(Message);
            if (await _repo.SaveAll())
            {
                var MessageToReturn = _mapper.Map<MessageToReturnDTO>(Message);
                return CreatedAtRoute("GetMessage", new { id = Message.Id }, MessageToReturn);
            }
            throw new Exception("Creating message failed on server");
        }
        [HttpPost("{Id}")]
        public async Task<IActionResult> DeleteMessage(int Id , int UserId)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var MessageFromReo = await _repo.GetMessage(Id);
            if (MessageFromReo.SenderId == UserId)
                MessageFromReo.SenderDeleted = true;
            if (MessageFromReo.RecipientId == UserId)
                MessageFromReo.RecipientDeleted = true;
            if (MessageFromReo.SenderDeleted == true && MessageFromReo.RecipientDeleted == true)
                _repo.Delete(MessageFromReo);
            if (await _repo.SaveAll())
                return Ok();
            throw new Exception("Error n deleting message");
        }
        [HttpPost("{Id}/read")]
        public async Task<IActionResult> MarkMessageAsRead (int UserId , int Id)
        {
            if (UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var Message = await _repo.GetMessage(Id);
            if (Message.RecipientId != UserId)
                return Unauthorized();
            Message.IsRead = true;
            Message.DateReaded = DateTime.Now;
            await _repo.SaveAll();
            return NoContent();
        }
    }
}