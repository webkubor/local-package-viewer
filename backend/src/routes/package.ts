import Router from 'koa-router';
import packageController from '../controller/packageController';

const router = new Router({ prefix: '/api/package' });

router.get('/global', packageController.getGlobalDependencies);
router.delete('/global/:packageName', packageController.removeGlobalPackage);
router.get('/search', packageController.searchPackage);
router.get('/info/:packageName', packageController.getPackageInfo);
router.post('/global', packageController.installGlobalPackage);

export default router; 