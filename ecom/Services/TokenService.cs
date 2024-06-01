using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ecom.Interfaces;
using ecom.Models;
using Microsoft.IdentityModel.Tokens;

namespace ecom.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(ShopModel shop, int expires, string publicKey, string privateKey)
        {
            var claims = new List<Claim>{
                new Claim(JwtRegisteredClaimNames.Email, shop.Email),
                new Claim(JwtRegisteredClaimNames.GivenName, shop.Name)
            };

            var roles = shop.Roles;
            foreach(var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));
            // new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(privateKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(expires),
                SigningCredentials = creds,
                Issuer = _config["JWT:Issuer"],
                Audience = _config["JWT:Audience"],
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public static bool VerifyToken(string token, string publicKey, out ClaimsPrincipal claimsPrincipal)
        {
            claimsPrincipal = null;

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "your_issuer",
                    ValidAudience = "your_audience",
                    IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String(publicKey))
                };

                SecurityToken validatedToken;
                claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
                
                return true; // Token is valid
            }
            catch (Exception ex)
            {
                // Token validation failed
                Console.WriteLine("Token validation failed: " + ex.Message);
                return false; // Token is invalid
            }
        }
    }
}