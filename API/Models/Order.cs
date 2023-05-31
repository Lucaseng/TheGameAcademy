using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A2.Models
{
    public class Order
    {
        public String userName { get; set; }
        public Int64 productId { get; set; }
    }
}