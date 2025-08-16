using HTC.Backend.Models;
using HTC.Backend.Services;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace HTC.Backend.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : BaseModel
{
    protected readonly IMongoCollection<T> _collection;

    public BaseRepository(IMongoDbContext context)
    {
        _collection = context.GetCollection<T>();
    }

    public virtual async Task<T?> GetByIdAsync(string id)
    {
        return await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.Find(predicate).ToListAsync();
    }

    public virtual async Task<T> CreateAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(entity);
        return entity;
    }

    public virtual async Task<bool> UpdateAsync(string id, T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        var result = await _collection.ReplaceOneAsync(x => x.Id == id, entity);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public virtual async Task<bool> DeleteAsync(string id)
    {
        var result = await _collection.DeleteOneAsync(x => x.Id == id);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }

    public virtual async Task<(IEnumerable<T> Items, long TotalCount)> GetPagedAsync(
        int page, 
        int pageSize, 
        Expression<Func<T, bool>>? filter = null,
        Expression<Func<T, object>>? orderBy = null,
        bool ascending = true)
    {
        var filterDefinition = filter != null ? Builders<T>.Filter.Where(filter) : Builders<T>.Filter.Empty;
        
        var totalCount = await _collection.CountDocumentsAsync(filterDefinition);
        
        var query = _collection.Find(filterDefinition);
        
        if (orderBy != null)
        {
            query = ascending ? query.SortBy(orderBy) : query.SortByDescending(orderBy);
        }
        else
        {
            query = query.SortByDescending(x => x.CreatedAt);
        }
        
        var items = await query
            .Skip((page - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
            
        return (items, totalCount);
    }
}