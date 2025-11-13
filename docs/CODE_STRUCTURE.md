# Repository Structure

> [!NOTE]  
> The project follows a **monorepo-style structure** with distinct folders for client, server, and documentation to maintain modularity and ease of contribution.  
> Contributors can work independently on either the **frontend (client)** or **backend (server)** using the deployed APIs.

```yaml
code-a2z/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug-report.yml
│   │   ├── enhancement-request.yml
│   │   └── feature-request.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── auto-comment-on-issue.yml
│       ├── auto-comment-pr-raise.yml
│       └── format-check.yml
├── .gitignore
├── .husky/
│   └── pre-commit
├── .prettierignore
├── .prettierrc
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── client/
│   ├── .env.example
│   ├── .vercelignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── 404.png
│   │   ├── full-logo.png
│   │   ├── logo.png
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.tsx
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── infra/
│   │   │   ├── rest/
│   │   │   │   ├── apis/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── typing.ts
│   │   │   │   │   ├── collaboration/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── collection/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── typing.ts
│   │   │   │   │   ├── comment/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── typing.ts
│   │   │   │   │   ├── like/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── typing.ts
│   │   │   │   │   ├── media/
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── notification/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── typing.ts
│   │   │   │   │   ├── project/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── typing.ts
│   │   │   │   │   ├── subscriber/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── typing.ts
│   │   │   │   │   └── user/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── typing.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── typings/
│   │   │   │       ├── collaboration.ts
│   │   │   │       ├── collection.ts
│   │   │   │       ├── comment.ts
│   │   │   │       ├── index.ts
│   │   │   │       ├── notification.ts
│   │   │   │       ├── project.ts
│   │   │   │       ├── subscriber.ts
│   │   │   │       └── user.ts
│   │   │   ├── states/
│   │   │   │   ├── auth.ts
│   │   │   │   └── user.ts
│   │   │   └── types/
│   │   │       ├── editorjs-modules.d.ts
│   │   │       └── vite-env.d.ts
│   │   ├── main.tsx
│   │   ├── modules/
│   │   │   ├── 404/
│   │   │   │   └── index.tsx
│   │   │   ├── change-password/
│   │   │   │   └── index.tsx
│   │   │   ├── edit-profile/
│   │   │   │   ├── constants/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.tsx
│   │   │   ├── editor/
│   │   │   │   ├── components/
│   │   │   │   │   ├── editor-navbar.tsx
│   │   │   │   │   ├── project-editor.tsx
│   │   │   │   │   ├── publish-form.tsx
│   │   │   │   │   ├── tags.tsx
│   │   │   │   │   ├── text-editor.tsx
│   │   │   │   │   └── tools.tsx
│   │   │   │   ├── constants/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── use-project-editor.ts
│   │   │   │   ├── index.tsx
│   │   │   │   └── states/
│   │   │   │       └── index.ts
│   │   │   ├── home/
│   │   │   │   ├── components/
│   │   │   │   │   ├── banner-project-card.tsx
│   │   │   │   │   ├── category-button.tsx
│   │   │   │   │   └── no-banner-project.tsx
│   │   │   │   ├── constants/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.tsx
│   │   │   │   └── states/
│   │   │   │       └── index.ts
│   │   │   ├── manage-projects/
│   │   │   │   ├── components/
│   │   │   │   │   ├── draft-projects.tsx
│   │   │   │   │   └── publish-projects.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.tsx
│   │   │   │   └── states/
│   │   │   │       └── index.ts
│   │   │   ├── notification/
│   │   │   │   ├── components/
│   │   │   │   │   ├── notificationCard.tsx
│   │   │   │   │   └── notificationCommentField.tsx
│   │   │   │   ├── constants/
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.tsx
│   │   │   ├── profile/
│   │   │   │   ├── components/
│   │   │   │   │   └── about-user.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.tsx
│   │   │   │   └── states/
│   │   │   │       └── index.ts
│   │   │   ├── project/
│   │   │   │   ├── components/
│   │   │   │   │   ├── project-content.tsx
│   │   │   │   │   └── project-interaction.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── use-project-interaction.ts
│   │   │   │   ├── index.tsx
│   │   │   │   └── states/
│   │   │   │       └── index.ts
│   │   │   ├── search/
│   │   │   │   ├── components/
│   │   │   │   │   └── user-card.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.tsx
│   │   │   │   └── states/
│   │   │   │       └── index.ts
│   │   │   └── user-auth-form/
│   │   │       ├── hooks/
│   │   │       │   └── index.ts
│   │   │       └── index.tsx
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── atoms/
│   │       │   │   ├── button/
│   │       │   │   │   └── index.tsx
│   │       │   │   ├── icon-button/
│   │       │   │   │   └── index.tsx
│   │       │   │   ├── input-box/
│   │       │   │   │   └── index.tsx
│   │       │   │   ├── modal/
│   │       │   │   │   └── index.tsx
│   │       │   │   ├── no-data-msg/
│   │       │   │   │   └── index.tsx
│   │       │   │   ├── skeleton/
│   │       │   │   │   ├── components/
│   │       │   │   │   │   ├── banner-skeleton.tsx
│   │       │   │   │   │   ├── no-banner-skeleton.tsx
│   │       │   │   │   │   └── project-skeleton.tsx
│   │       │   │   │   └── index.tsx
│   │       │   │   └── typography/
│   │       │   │       └── index.tsx
│   │       │   ├── molecules/
│   │       │   │   ├── notification/
│   │       │   │   │   └── index.tsx
│   │       │   │   ├── page-navigation/
│   │       │   │   │   └── index.tsx
│   │       │   │   └── theme/
│   │       │   │       ├── index.tsx
│   │       │   │       └── mui.ts
│   │       │   └── organisms/
│   │       │       ├── comments-wrapper/
│   │       │       │   ├── components/
│   │       │       │   │   ├── comment-card.tsx
│   │       │       │   │   └── comment-field.tsx
│   │       │       │   ├── hooks/
│   │       │       │   │   └── index.ts
│   │       │       │   ├── index.tsx
│   │       │       │   └── states/
│   │       │       │       └── index.ts
│   │       │       ├── navbar/
│   │       │       │   ├── components/
│   │       │       │   │   ├── render-menu.tsx
│   │       │       │   │   ├── render-mobile-menu.tsx
│   │       │       │   │   └── subscribe.tsx
│   │       │       │   ├── constants/
│   │       │       │   │   └── index.ts
│   │       │       │   ├── hooks/
│   │       │       │   │   └── index.ts
│   │       │       │   └── index.tsx
│   │       │       └── sidebar/
│   │       │           ├── hooks/
│   │       │           │   └── index.ts
│   │       │           └── index.tsx
│   │       ├── hooks/
│   │       │   ├── use-auth.ts
│   │       │   ├── use-debounce.ts
│   │       │   ├── use-device.ts
│   │       │   ├── use-notification.ts
│   │       │   ├── use-theme.ts
│   │       │   └── use-throttle-fetch.ts
│   │       ├── states/
│   │       │   ├── notification.ts
│   │       │   └── theme.ts
│   │       └── utils/
│   │           ├── api-interceptor.ts
│   │           ├── date.ts
│   │           ├── local.ts
│   │           └── regex.ts
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.ts
├── docs/
│   ├── Code A2Z.postman_collection.json
│   ├── FORMATTING.md
│   └── SETUP.md
├── eslint.config.mjs
├── package-lock.json
├── package.json
└── server/
├── .dockerignore
├── .env.example
├── Dockerfile
├── docker-compose.yaml
├── index.js
├── package-lock.json
├── package.json
└── src/
├── config/
│   ├── cloudinary.js
│   ├── db.js
│   ├── env.js
│   └── resend.js
├── constants/
│   ├── db.js
│   └── index.js
├── controllers/
│   ├── auth/
│   │   ├── change-password.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   ├── refresh.js
│   │   ├── signup.js
│   │   └── utils/
│   │       └── index.js
│   ├── collaboration/
│   │   ├── accept-invite.js
│   │   ├── invite-collab.js
│   │   ├── list-collab.js
│   │   └── reject-invite.js
│   ├── collection/
│   │   ├── create-collection.js
│   │   ├── delete-collection.js
│   │   ├── remove-project.js
│   │   ├── save-project.js
│   │   └── sort-project.js
│   ├── comment/
│   │   ├── add-comment.js
│   │   ├── delete-comment.js
│   │   ├── get-comments.js
│   │   └── get-replies.js
│   ├── like/
│   │   ├── like-project.js
│   │   └── like-status.js
│   ├── media/
│   │   └── upload.image.js
│   ├── notification/
│   │   ├── all-notifications-count.js
│   │   ├── get-notifications.js
│   │   └── notification-status.js
│   ├── project/
│   │   ├── create-project.js
│   │   ├── delete-project.js
│   │   ├── get-all-projects.js
│   │   ├── get-project.js
│   │   ├── search-projects-count.js
│   │   ├── search-projects.js
│   │   ├── total-projects-count.js
│   │   ├── trending-projects.js
│   │   ├── user-projects-count.js
│   │   └── user-projects.js
│   ├── subscriber/
│   │   ├── get-all-subscribers.js
│   │   ├── subscribe-email.js
│   │   └── unsubscribe-email.js
│   └── user/
│       ├── get-profile.js
│       ├── search-user.js
│       ├── update-profile-img.js
│       └── update-profile.js
├── logger/
│   ├── morgan.js
│   └── winston.js
├── middlewares/
│   ├── auth.limiter.js
│   ├── auth.middleware.js
│   ├── error.handler.js
│   ├── general.limiter.js
│   ├── logging.middleware.js
│   ├── multer.middleware.js
│   ├── sanitize.middleware.js
│   └── security.middleware.js
├── models/
│   ├── collaboration.model.js
│   ├── collection.model.js
│   ├── comment.model.js
│   ├── notification.model.js
│   ├── project.model.js
│   ├── subscriber.model.js
│   └── user.model.js
├── routes/
│   ├── api/
│   │   ├── auth.routes.js
│   │   ├── collaboration.routes.js
│   │   ├── collections.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── media.routes.js
│   │   ├── monitor.routes.js
│   │   ├── notification.routes.js
│   │   ├── project.routes.js
│   │   ├── subscriber.routes.js
│   │   └── user.routes.js
│   └── index.js
├── schemas/
│   ├── collaboration.schema.js
│   ├── collection.schema.js
│   ├── comment.schema.js
│   ├── notification.schema.js
│   ├── project.schema.js
│   ├── subscriber.schema.js
│   └── user.schema.js
├── server.js
├── typings/
│   └── index.js
└── utils/
├── regex.js
└── response.js
```
