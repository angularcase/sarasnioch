import type { Schema, Struct } from '@strapi/strapi';

export interface SharedLeaflet extends Struct.ComponentSchema {
  collectionName: 'components_shared_leaflets';
  info: {
    description: 'Downloadable PDF leaflet with caption';
    displayName: 'Leaflet';
  };
  attributes: {
    caption: Schema.Attribute.String & Schema.Attribute.Required;
    file: Schema.Attribute.Media<'files'> & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.leaflet': SharedLeaflet;
    }
  }
}
