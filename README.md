# interactive-crud

This project is intentionally left lightly documented for interview review purposes. The application fulfills the required features from the challenge prompt, including:

- Server-side fetching of todos from the JSONPlaceholder API
- Prepopulating the list with 3 unique random todos using linear-time shuffling
- Full CRUD operations (Create, Read, Update, Delete) with persistent storage
- Functional separation between Server and Client Components using the App Router
- File-backed server actions to simulate a backend store

This app could be further containerized and split into services using Docker Compose and a Node-based API, but for this challenge I kept persistence local and embedded for simplicity. 

A simple way for me to achieve the multi-service architecture would be to make a .env file, docker-compose and two service files for the frontend and backend. Some small adjustments would be made in the actions.ts to existing functions and new post/delete, post/clear and post/edit endpoints. 

The benefit of this would be to flexibly change the tech stacks, independent scaling of the services and an improved collaborative development experience.

## Next Steps (Planned Enhancements)

- [X] Toggle "Completed" status
- [ ] Styling and layout improvements
- [ ] Filter (All / Active / Completed) support
- [ ] Expandable list item views
- [ ] Animations and transition effects
- [ ] Add a small interactive minigame on loading
- [ ] Optimize performance using a Todo HashList and rewrite shuffle
- [ ] Dockerize the backend/frontend

---

> Due to work shifts over the weekend (part-time at Home Depot receiving during spring season), some enhancements are in progress but not yet completed. The core application is functional and I plan to polish the remaining items by Monday evening.
