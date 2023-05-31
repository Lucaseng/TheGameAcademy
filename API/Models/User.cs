using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A2.Models
{
    public class User
    {
        [Key]
        public String UserName { get; set; }
        public String? Password { get; set; }
        public String? Address { get; set; }
    }
}