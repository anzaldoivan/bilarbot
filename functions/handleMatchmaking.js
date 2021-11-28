const express = require("express");
const app = express();
const package = require("../utils/eloPost.js");
const isSigned = require("../utils/isSigned.js");
const unsign = require("../utils/unsign.js");
const signed = require("../utils/signedList.js");

// Express JSON
app.use(express.json());

app.listen(5000, "0.0.0.0", () => {
  console.log(`Server started on port 5000`);
});

module.exports = (client) => {
  client.handleMatchmaking = async () => {
    app.post("/api/postuploadios", (req, res) => {
      package.eloPost(req, res, client.config, client);
    });
    // ELO Feature.
    client.on("presenceUpdate", (oldPresence, newPresence) => {
      if (oldPresence) {
        if (oldPresence.status !== newPresence.status) {
          // The user's status changed
          if (newPresence.status === "offline") {
            // Use the online count here.
            let arr;

            if (isSigned.isSigned(`<@${newPresence.user.id}>`)) {
              client.users.cache
                .get(newPresence.user.id)
                .send("Removido de la lista de MM por desconexion.")
                .catch((error) => {
                  console.log(`User ${newPresence.user.id} has blocked DM`);
                });
              unsign.unsign(`<@${newPresence.user.id}>`);
              //   client.channels.cache
              //     .get(client.config.mm_channel)
              //     .send({ embeds: [signed.signedList(client.config)] });
            }
          }
        }
      }
    });
  };
};

//console.log("offline detected");
//console.log(newPresence.user.id);
