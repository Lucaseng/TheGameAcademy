using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using A2.Models;

namespace A2.Data
{
    public class A2DBContext: DbContext
    {
        public A2DBContext(DbContextOptions<A2DBContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<GameRecord> GameRecords { get; set; }
    }
}