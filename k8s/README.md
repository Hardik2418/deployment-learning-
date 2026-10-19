# Kubernetes deployment

Build the image from the project root:

```powershell
docker build --tag deployment-learning:local .
```

Apply the Deployment and Service:

```powershell
kubectl apply -f k8s/deployment.yaml -f k8s/services.yaml
kubectl get pods,service deployment-learning
```

The application is exposed through NodePort `30080`.

- Minikube: `minikube service deployment-learning --url`
- Docker Desktop Kubernetes: open `http://localhost:30080`

The app uses sample data when `MONGODB_URI` is not set. To connect it to MongoDB,
create a Kubernetes Secret without committing credentials:

```powershell
kubectl create secret generic deployment-learning-secrets `
  --from-literal=mongodb-uri="mongodb://<host>:27017/field_notes"
kubectl rollout restart deployment/deployment-learning
```

Remove the resources with:

```powershell
kubectl delete -f k8s/deployment.yaml -f k8s/services.yaml
```
