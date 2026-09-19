#Migration

Wenn eine neue Klasse eingefügt wird, so landet diese nicht direkt in der Datenbank. Die Datenbank muss zunächst Migriert werden. 

# Vorgehen

folgende Befehle müssen in dieser Reihenfolge genutzt werden

```

dotnet ef migrations add BeschreibenderNameDerAenderung

```

und dann 

```

dotnet ef database update

```



```
```
