using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using ecom.Dto.Shop;
using ecom.Models;
using MongoDB.Driver;

namespace ecom.Mappers
{
    public static class ShopMapper
    {
        public static ShopDto ShopToShopDto(this ShopModel shop, string AccessToken, string RefreshToken)
        {
            return new ShopDto
            {
                Id = shop.Id,
                Name = shop.Name,
                Email = shop.Email,
                AccessToken = AccessToken,
                RefreshToken = RefreshToken
            };
        } 
    }
}