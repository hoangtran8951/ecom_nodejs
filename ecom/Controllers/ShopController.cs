using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ecom.Dto.Shop;
using ecom.Helpers;
using ecom.Interfaces;
using ecom.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ecom.Controllers
{
    [Route("v1/api/shop")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly IShopRepository _shopRepository;
        private readonly IKeyTokenRepository _keyTokenRepository;
        private readonly ITokenService _tokenService;
        public ShopController(IShopRepository shopRepository, IKeyTokenRepository keyTokenRepository, ITokenService tokenService)
        {
            _shopRepository = shopRepository;
            _keyTokenRepository = keyTokenRepository;
            _tokenService = tokenService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var shopModel = await _shopRepository.GetByIdAsync(id);
            if(shopModel == null)
            {
                return BadRequest("This Shop does not exist");
            }

            return Ok(shopModel.ShopToShopDto("abc", "def"));
            // return Ok();
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDto shop)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            
            if(!await _shopRepository.CheckEmailExistedAsync(shop.Email))
            {
                return BadRequest("Email already existed");
            }
            var PasswordHashed = shop.Password.PasswordHashed();
            var createShop = await _shopRepository.CreateShop(shop.Name, shop.Email, PasswordHashed, ["SHOP"]);
            if(createShop == null)
            {
                return BadRequest("CreateShop error");
            }
            var publicKey = KeyGenerate.CreateKey();
            var privateKey = KeyGenerate.CreateKey();

            var keyStore = _keyTokenRepository.CreateKeyTokens(createShop.Id, publicKey, privateKey);
            // Create Token pair
            // var AccessToken = _tokenService.CreateToken(createShop, 2);
            // var RefreshToken = _tokenService.CreateToken(createShop, 7);

            return CreatedAtAction(nameof(GetById), new {id = createShop.Id}, createShop.ShopToShopDto("abc", "def"));
            // return Ok();
        }
    }
}