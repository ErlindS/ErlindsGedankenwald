#:sdk Aspire.AppHost.Sdk@13.5.4
#:package Aspire.Hosting.JavaScript@13.5.4
#:property AspireUseCliBundle=true

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject("api", "Backend/GreenBlog.Api/GreenBlog.Api.csproj")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health");

builder.AddJavaScriptApp("frontend", "Frontend", runScriptName: "start")
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(port: 4200, isProxied: false);

builder.Build().Run();
