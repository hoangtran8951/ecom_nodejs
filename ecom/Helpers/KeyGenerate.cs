using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace ecom.Helpers
{
    public static class KeyGenerate
    {
        public static string CreateKey()
        {
        // Create a byte array to hold the random bytes
            byte[] randomBytes = new byte[32];

            // Use RNGCryptoServiceProvider to fill the byte array with random bytes
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }

            // Convert the byte array to a hexadecimal string
            string publicKey = BitConverter.ToString(randomBytes).Replace("-", "");
            return publicKey;
        }
    }
}