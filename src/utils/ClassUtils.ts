/** ClassUtils */
export const ClassUtils = {
  // Bind classInstance to methods
  bindMethods(classMethodNames: string[], classInstance: InstanceType<any>) {
    classMethodNames.forEach(classMethod => {
      classInstance[classMethod] = classInstance[classMethod].bind(classInstance);
    });
  }
};

export default ClassUtils;