using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppAPI.Helpers
{
    public static class Extensions
    {
        public  static void AddApplcationError(this HttpResponse response ,string message)
        {
            response.Headers.Add("Applcation-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Applcation-Error");
            response.Headers.Add("Access-Control-Allow-origin", "*");
        }
        public static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var PaginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", 
                JsonConvert.SerializeObject(PaginationHeader ,camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
        public static int CalculateAge(this DateTime TheDateTime )
        {
            var age = DateTime.Today.Year - TheDateTime.Year;
            if (TheDateTime.AddYears(age) > DateTime.Today)
                age--;
            return age;
        }
    }
}
