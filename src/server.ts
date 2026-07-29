import { Server } from "http";
import app from "./app";
import config from "./config";
import "dotenv/config";
import seedAdmin from "./app/helper/seedAdmin";

async function bootstrap() {
  // This variable will hold our server instance
  let server: Server;

  try {
    // Start the server
    await seedAdmin()
    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
    });

    // Function to gracefully shut down the server
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully.");
          process.exit(1); // Exit with a failure code
        });
      } else {
        process.exit(1);
      }
    };

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (error) => {
      console.log(
        "Unhandled Rejection is detected, we are closing our server...",
      );
      if (server) {
        server.close(() => {
          console.log(error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

bootstrap();




// import { Server } from "http";
// import app from "./app";
// import config from "./config";
// import "dotenv/config";
// import seedAdmin from "./app/helper/seedAdmin";
// import seedData from "./app/helper/seedData";

// const runServer = async () => {
//   let server: Server;

//   try {
//     await seedAdmin();
//     server = app.listen(config.port, () => {
//       console.log(`🚀 Server is running on http://localhost:${config.port}`);
//     });

//     const exitHandler = () => {
//       if (server) {
//         server.close(() => {
//           console.log("Server closed gracefully.");
//           process.exit(1);
//         });
//       } else {
//         process.exit(1);
//       }
//     };

//     process.on("unhandledRejection", (error) => {
//       console.log(
//         "Unhandled Rejection is detected, we are closing our server...",
//       );
//       if (server) {
//         server.close(() => {
//           console.log(error);
//           process.exit(1);
//         });
//       } else {
//         process.exit(1);
//       }
//     });
//   } catch (error) {
//     console.error("Error during server startup:", error);
//     process.exit(1);
//   }
// };

// const runSeedData = async () => {
//   try {
//     await seedData();
//     console.log("Fake data seeded successfully.");
//     process.exit(0);
//   } catch (error) {
//     console.error("Failed to seed fake data:", error);
//     process.exit(1);
//   }
// };

// if (process.env.SEED_FAKE_DATA === "true") {
//   runSeedData();
// } else {
//   runServer();
// }
