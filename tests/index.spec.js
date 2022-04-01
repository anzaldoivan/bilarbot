const { json } = require("express/lib/response");
const path = require("path");
const pathutils = path.resolve("src", "utils");
const pathteams = path.resolve("src", "teams");
const {
  canRelease,
  isCaptain,
  canTransfer,
  checkConfirmedMatches,
} = require(`${pathutils}/teams/CheckPerms.js`);
const teams = require(`${pathteams}/t9.json`);

console.log(pathutils);

function mockUser(id) {
  const json = {
    member: {
      user: {
        id: id,
      },
    },
  };
  return json;
}

console.log(mockUser(779492937176186881).member.user.id);

describe("Functions", function () {
  describe("Check Perms", function () {
    it("should return true (BilarBot is Captain)", function () {
      const interaction = mockUser(779492937176186881);
      expect(isCaptain(interaction, teams["TEST"], "0")).toStrictEqual(true);
    });
    it("should return false (Baba is not Captain)", function () {
      const interaction = mockUser(326867345316511746);
      expect(isCaptain(interaction, teams["TEST"], "0")).toStrictEqual(false);
    });
  });
});
