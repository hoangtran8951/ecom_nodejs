using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ecom.Dto.Shop
{
    public class ShopDto
    {
        public string Id {get; set;} = string.Empty;
        public string Name {get; set;} = string.Empty;
        public string Email {get; set;} = string.Empty;
        public string AccessToken {get; set;} = string.Empty;
        public string RefreshToken {get; set;} = string.Empty;
    }
}