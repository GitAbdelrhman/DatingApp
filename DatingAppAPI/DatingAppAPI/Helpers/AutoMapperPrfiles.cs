using AutoMapper;
using DatingAppAPI.Dtos;
using DatingAppAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppAPI.Helpers
{
    public class AutoMapperPrfiles :Profile
    {
        public AutoMapperPrfiles()
        {
            CreateMap<User, UserForListDTO>().ForMember(
                dest => dest.PhotoUrl  , opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(f => f.IsMain).Url);
                }
                ).ForMember(
                age => age.Age , opt =>
                {
                    opt.MapFrom(d => d.DateOfBirth.CalculateAge());
                });
            CreateMap<User, UserForDetailedDTO>().ForMember(
                dest => dest.PhotoURL, opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(f => f.IsMain).Url);
                }
                ).ForMember(
                age => age.Age, opt =>
                {
                    opt.MapFrom(d => d.DateOfBirth.CalculateAge());
                });
            CreateMap<Photo , PhotosForDetailedDTO>();
            CreateMap<UserForUpdateDTO, User >();
            CreateMap<Photo, PhotoForReturnDTO>();
            CreateMap<PhotoForCreationDTO, Photo>();
            CreateMap<UserForRegisterDTO, User>();
            CreateMap<MessageForCreationDTO ,Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDTO>()
                .ForMember(f => f.SenderPhotoURL, f => f.MapFrom(d => d.Sender.Photos.FirstOrDefault(i => i.IsMain == true).Url))
                .ForMember(g => g.RecipientPhotoURL, n => n.MapFrom(g => g.Recipient.Photos.FirstOrDefault(l => l.IsMain).Url));


        }
    }
}
