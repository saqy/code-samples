import toSnippet from '../util/toSnippet'
import assignImageParams from '../util/assignImageParams'
import parseFilePaths from '../util/parseFilePaths'

export default {
     categories: (root, args, context) => {
         return context.dataSources.database.categories[root.language].load({entry_id: root.entry_id, group_id: 22})
     },

     image: (root, args, context) => {
         return context.dataSources.database.assets.load({entry_id: root.entry_id, field_id: 153})
             .then(firstOrNull)
             .then(assignImageParams(args.params))
     },

     no_text_image: (root, args, context) => {
         return context.dataSources.database.assets.load({entry_id: root.entry_id, field_id: 404})
             .then(firstOrNull)
             .then(assignImageParams(args.params))
     },

     square_image: (root, args, context) => {
         return context.dataSources.database.assets.load({entry_id: root.entry_id, field_id: 358})
             .then(firstOrNull)
             .then(assignImageParams(args.params))
     },

     teachers: (root, args, context) => {
         if (!root.field_id_104) {
             return Promise.resolve([])
         }

         const memberIds = root.field_id_104.split('|')

         return Promise.all(
             memberIds.map(memberId => context.dataSources.database.Course.teachers.load(memberId))
         )
     },

     duration: (root, args, context) => {
         return {
             text: root.field_id_237,
             url_title: root.field_id_237.replace(/s+/g, '-').toLowerCase(),
        }
     },

     chapters: (root, args, context) => {
         return context.dataSources.database.Course.chapters.load(root.entry_id)
             .then(rows => rows.map(row => {
                 return {
                     row_id: row.row_id,
                     entry_id: row.entry_id,
                     id: row.row_id,
                     name: row.col_id_10,
                     language: root.language,
                 }
             }))
     },

     addon: (root, args, context) => {
         return context.dataSources.database.Course.addon[root.language].load(root.entry_id)
     },

     sales_page_select: (root, args, context) => {
         return context.dataSources.database.Course.sales_page_select[root.language].load(root.entry_id).then(firstOrNull)
     },

       alternate_access: (root, args, context) => {
         if (!root.field_id_361) {
             return Promise.resolve([])
         }

         const entry_ids = root.field_id_361.split('|')

         return Promise.all(
             entry_ids.map(entry_id => context.dataSources.database.Course.alternate_access.load(entry_id))
         )
     },

     snippet: (root, args, context) => {
         return toSnippet(root.short_description, args.limit)
     },

     description: (root, args, context) => {
         return parseFilePaths(root.field_id_105, context)
     },
  }