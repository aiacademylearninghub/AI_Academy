# Course Data Management

This document explains how to add, update, and manage course data for the AI Academy application.

## Course Data Structure

The `courses.json` file uses the following structure:

```json
{
  "categories": [
    {
      "id": "category-id",
      "name": "Category Display Name",
      "description": "Category description",
      "courses": [
        {
          "id": 1,
          "title": "Course Title",
          "description": "Course description",
          "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
        }
      ]
    },
    {
      "id": "category-with-subcategories",
      "name": "Category With Subcategories",
      "description": "Category description",
      "subcategories": [
        {
          "id": "subcategory-id",
          "name": "Subcategory Name",
          "courses": [
            {
              "id": 5,
              "title": "Course in Subcategory",
              "description": "Course description",
              "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
            }
          ]
        }
      ]
    }
  ]
}
```

## Adding New Content

### To add a new course to an existing category:

Add a new object to the `courses` array of the relevant category:

```json
{
  "id": 123,  // Use a unique ID
  "title": "New Course Title",
  "description": "Course description text",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### To add a new category:

Add a new object to the `categories` array:

```json
{
  "id": "unique-category-id",
  "name": "Category Display Name",
  "description": "Category description",
  "courses": [
    // Array of course objects
  ]
}
```

### To add a subcategory:

Add a new object to the `subcategories` array of a category:

```json
{
  "id": "subcategory-id",
  "name": "Subcategory Name",
  "courses": [
    // Array of course objects
  ]
}
```

## YouTube URL Formats

The following YouTube URL formats are supported:

- Full YouTube URLs: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short YouTube URLs: `https://youtu.be/VIDEO_ID`
- Embed URLs: `https://www.youtube.com/embed/VIDEO_ID`
- Direct video IDs: `VIDEO_ID` (just the 11-character code)
