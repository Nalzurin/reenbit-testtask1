Using TypeScript react for front end and ASP.NET Core Web API for backend. For real-time web functionality im using SignalR. For storage I am using an Azure SQL Database.
Deployed front-end to azure static website and the back end to the azure app. Due to the way serverless architecture and the free tier works on Azure, it takes from 20 to 60 seconds for the servers to load,
meaning that the front end might be broken for a bit before the back end can do its work
