import {AsyncParallelHook,SyncHook} from 'tapable'
class Car {
	constructor() {
		this.hooks = {
			accelerate: new SyncHook(["newSpeed"]),
			brake: new SyncHook(),
			calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
		};
	}
    setSpeed(newSpeed) {
		// following call returns undefined even when you returned values
		this.hooks.accelerate.call(newSpeed);
	}

	useNavigationSystemPromise(source, target) {
		const routesList = new List();
		return this.hooks.calculateRoutes.promise(source, target, routesList).then((res) => {
			// res is undefined for AsyncParallelHook
			return routesList.getRoutes();
		});
	}

	useNavigationSystemAsync(source, target, callback) {
		const routesList = new List();
		this.hooks.calculateRoutes.callAsync(source, target, routesList, err => {
			if(err) return callback(err);
			callback(null, routesList.getRoutes());
		});
	}

	/* ... */
}
const car=new Car()
car.hooks.accelerate.tap('test',(speed)=>{
    console.log('accelerate',speed)
})
car.hooks.calculateRoutes.tap('promise',(source,target)=>{
    console.log('promise',source,target)
})
car.setSpeed('10')
car.useNavigationSystemPromise([1,2,3],1)