import type { Core } from '@strapi/strapi';

const PUBLIC_PERMISSIONS = [
  { action: 'api::product.product.find' },
  { action: 'api::product.product.findOne' },
  { action: 'api::manufacturer.manufacturer.find' },
  { action: 'api::manufacturer.manufacturer.findOne' },
  { action: 'api::article.article.find' },
  { action: 'api::article.article.findOne' },
  { action: 'api::animal-category.animal-category.find' },
  { action: 'api::animal-category.animal-category.findOne' },
];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const existingPermissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });

    const existingActions = new Set(existingPermissions.map((p) => p.action));

    for (const perm of PUBLIC_PERMISSIONS) {
      if (!existingActions.has(perm.action)) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: perm.action, role: publicRole.id },
        });
      }
    }
  },
};
