// scripts/test-db.ts
import "dotenv/config";
import { Pool } from "pg";

async function testConnection() {
  console.log("\n🔍 Testing Database Connection…\n");

  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("❌ ERROR: DATABASE_URL is missing in your .env file!");
    console.log("👉 Please set DATABASE_URL in .env to your AlwaysData PostgreSQL or local Postgres connection string.");
    process.exit(1);
  }

  // Mask credentials for display
  const maskedUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
  console.log(`📡 Connecting to: ${maskedUrl}`);

  const pool = new Pool({ connectionString: dbUrl });

  try {
    const client = await pool.connect();
    const result = await client.query("SELECT current_database(), current_user, version();");
    client.release();
    await pool.end();

    console.log("\n✅ DATABASE CONNECTION SUCCESSFUL!");
    console.log(`   Database: ${result.rows[0].current_database}`);
    console.log(`   User:     ${result.rows[0].current_user}`);
    console.log(`   Version:  ${result.rows[0].version.split(" ")[0]} ${result.rows[0].version.split(" ")[1]}`);
    console.log("\n🎉 Your PostgreSQL database is ready to use!\n");
  } catch (error: any) {
    await pool.end().catch(() => {});
    console.error("\n❌ DATABASE CONNECTION FAILED!");
    console.error(`   Error message: ${error.message}`);
    if (error.code) console.error(`   Error code:    ${error.code}`);

    console.log("\n💡 Troubleshooting Tips:");
    if (error.message?.includes("Invalid URL")) {
      console.log("   • The DATABASE_URL format is invalid.");
      console.log("   • Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require");
    } else if (error.code === "ECONNREFUSED") {
      console.log("   • Connection refused. Is your PostgreSQL server running?");
      console.log("   • Verify the host name and port (default 5432).");
    } else if (error.code === "28P01" || error.message?.includes("password")) {
      console.error("   • Authentication failed. Check your database username and password in .env.");
    } else if (error.code === "3D000") {
      console.error("   • Database does not exist. Make sure the database name is created on your PostgreSQL host.");
    }
    console.log("");
    process.exit(1);
  }
}

testConnection();
