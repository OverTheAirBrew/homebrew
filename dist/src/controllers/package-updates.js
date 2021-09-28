// import * as finder from 'find-package-json';
// import { run } from 'npm-check-updates';
// import * as packageInfo from 'package-info';
// import { Get, JsonController } from 'routing-controllers';
// import { Service } from 'typedi';
// @JsonController()
// @Service()
// export class PackageUpdatesController {
//   @Get('/package-updates')
//   async getPackageUpdates() {
//     const packages = finder();
//     const results = await run({
//       filter: ['@overtheairbrew/homebrew-plugin-*', 'ota-homebrew-plugin-*'],
//       silent: true,
//       packageFile: packages.next().filename,
//       jsonUpgraded: false,
//     });
//     return await Promise.all(
//       Object.keys(results).map(async (key) => {
//         const info = await packageInfo(key);
//         return {
//           name: key,
//           description: info.description || null,
//           author: info.author,
//           version: info.version,
//           homepage: info.homepage,
//         };
//       }),
//     );
//   }
// }
//# sourceMappingURL=package-updates.js.map